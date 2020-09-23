defmodule DndEncounter.Encounter do
  alias DndEncounter.{Repo, EncounterEvent}

  def get_events(limit \\ 20) do
    Repo.all(EncounterEvent, limit: limit)
    |> Enum.map(fn event -> %{
        id: event.id,
        timestamp: event.inserted_at,
        archive: event.archive,
        type: event.type,
        payload: event.payload,
      }
    end)
  end
end