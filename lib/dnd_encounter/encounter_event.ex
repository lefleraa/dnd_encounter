defmodule DndEncounter.EncounterEvent do
  alias DndEncounter.{Repo, Schema, EncounterEvent}
  use Schema
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

end
