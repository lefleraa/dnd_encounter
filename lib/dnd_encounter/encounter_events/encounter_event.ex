defmodule DndEncounter.EncounterEvents.EncounterEvent do
  alias DndEncounter.{Schema}
  use Schema
  import Ecto.Changeset

  schema "encounter_events" do
    field :archive, :boolean, default: false
    field :payload, :map
    field :type, :string

    timestamps()
  end

  @doc false
  def changeset(encounter_event, attrs) do
    encounter_event
    |> cast(attrs, [:type, :payload, :archive])
    |> validate_required([:type])
  end
end