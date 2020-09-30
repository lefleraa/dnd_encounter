defmodule DndEncounterWeb.EncounterEventView do
  use DndEncounterWeb, :view
  alias DndEncounterWeb.EncounterEventView

  def render("index.json", %{encounter_events: encounter_events}) do
    %{data: render_many(encounter_events, EncounterEventView, "encounter_event.json")}
  end

  def render("show.json", %{encounter_event: encounter_event}) do
    %{data: render_one(encounter_event, EncounterEventView, "encounter_event.json")}
  end

  def render("encounter_event.json", %{encounter_event: encounter_event}) do
    %{
      id: encounter_event.id,
      timestamp: encounter_event.inserted_at,
      archive: encounter_event.archive,
      type: encounter_event.type,
      payload: encounter_event.payload,
    }
  end
end
