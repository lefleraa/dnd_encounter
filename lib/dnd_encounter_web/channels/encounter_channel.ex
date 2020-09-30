defmodule DndEncounterWeb.EncounterChannel do
  alias DndEncounter.{EncounterEvents}
  use DndEncounterWeb, :channel

  @impl true
  def join("encounter:lobby", payload, socket) do
    if authorized?(payload) do
      send(self(), :after_join)
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  # @impl true
  # def handle_in("ping", payload, socket) do
  #   {:reply, {:ok, payload}, socket}
  # end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end

  def get_events() do
    %{ events: EncounterEvents.list_encounter_events()
      |> Enum.map(fn event -> %{
          id: event.id,
          timestamp: event.inserted_at,
          archive: event.archive,
          type: event.type,
          payload: event.payload,
        }
      end)
    }
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (encounter:lobby).
  @impl true
  def handle_in("event", payload, socket) do
    EncounterEvents.create_encounter_event(payload)
    broadcast(
      socket,
      "event",
      get_events()
    );
    {:noreply, socket}
  end

  @impl true
  def handle_info(:after_join, socket) do
    push(
      socket,
      "event",
      get_events()
    );
    {:noreply, socket} # :noreply
  end
end
