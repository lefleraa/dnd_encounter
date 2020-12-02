defmodule DndEncounterWeb.EncounterView do
  use DndEncounterWeb, :view
  alias DndEncounterWeb.EncounterView

  def render("index.json", %{encounters: encounters}) do
    %{data: render_many(encounters, EncounterView, "encounters.json")}
  end

  def render("show.json", %{encounter: encounter}) do
    %{data: render_one(encounter, EncounterView, "encounter.json")}
  end

  def render("encounters.json", %{encounter: encounter}) do
    %{
      id: encounter.id,
      name: encounter.name,
      started: encounter.started,
    }
  end

  def render("encounter.json", %{encounter: encounter}) do
    %{
      id: encounter.id,
      name: encounter.name,
      started: encounter.started,
      encounter_events: encounter.encounter_events
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
end
