defmodule DndEncounterWeb.EncounterView do
  use DndEncounterWeb, :view
  alias DndEncounterWeb.EncounterView

  def render("index.json", %{encounters: encounters}) do
    %{data: render_many(encounters, EncounterView, "encounter.json")}
  end

  def render("show.json", %{encounter: encounter}) do
    %{data: render_one(encounter, EncounterView, "encounter.json")}
  end

  def render("encounter.json", %{encounter: encounter}) do
    %{
      id: encounter.id,
      name: encounter.name,
      started: encounter.started
    }
  end
end
