defmodule DndEncounterWeb.EncounterChannel do
  alias DndEncounter.{Repo, EncounterEvent, Encounter}
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
  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  def get_events() do
    %{ events: Encounter.get_events() }
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (encounter:lobby).
  @impl true
  def handle_in("shout", payload, socket) do
    EncounterEvent.changeset(%EncounterEvent{}, payload)
    |> Repo.insert
    broadcast(
      socket,
      "shout",
      get_events
    );
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end

  def handle_info(:after_join, socket) do
    push(
      socket,
      "shout",
      get_events
    );
    {:noreply, socket} # :noreply
  end
end
