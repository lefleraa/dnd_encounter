defmodule DndEncounter.EncounterEvents.EncounterEvent do
  alias DndEncounter.{Schema}
  use Schema
  import Ecto.Changeset

  schema "encounter_events" do
    field :archive, :boolean, default: false
    field :payload, :map
    field :type, :string

    belongs_to :encounter, DndEncounter.Encounters.Encounter

    timestamps([type: :utc_datetime_usec])
  end

  @doc false
  def changeset(encounter_event, attrs) do
    encounter_event
    |> cast(attrs, [:type, :payload, :archive, :encounter_id])
    |> validate_required([:type, :encounter_id])
  end
end