defmodule DndEncounterWeb.EncounterChannel do
  use DndEncounterWeb, :channel
  alias DndEncounter.{Encounters, EncounterEvents}

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

  # TODO: figure out how to centralize this enum
  def get_events() do
    %{ encounter_events: EncounterEvents.list_encounter_events()
      |> Enum.map(fn event -> %{
          id: event.id,
          encounter_id: event.encounter_id,
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
  def handle_in(
    "event",
    %{
      "type" => type,
      "payload" => payload,
      "encounter_id" => encounter_id
    },
    socket)
  do
    EncounterEvents.create_encounter_event(%{
      type: type,
      payload: payload,
      encounter_id: encounter_id,
    })
    encounter = get_events()
    broadcast(
      socket,
      "event",
      %{ encounter: encounter }
    );
    {:noreply, socket}
  end

  @impl true
  def handle_info(:after_join, socket) do
    {:noreply, socket} # :noreply
  end
end
