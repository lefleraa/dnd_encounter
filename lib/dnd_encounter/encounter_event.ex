defmodule DndEncounter.EncounterEvent do
  use DndEncounter.Schema
  import Ecto.Changeset

  schema "encounter_events" do
    field :payload, :map
    field :type, :string

    timestamps()
  end

  @doc false
  def changeset(encounter_event, attrs) do
    encounter_event
    |> cast(attrs, [:type, :payload])
    |> validate_required([:type])
  end

  def get_events(limit \\ 20) do
    DndEncounter.Repo.all(DndEncounter.EncounterEvent, limit: limit)
  end
end
