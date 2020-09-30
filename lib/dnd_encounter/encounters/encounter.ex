defmodule DndEncounter.Encounters.Encounter do
  alias DndEncounter.{Schema}
  use Schema
  import Ecto.Changeset

  schema "encounters" do
    field :name, :string
    field :started, :boolean, default: false

    timestamps()
  end

  @doc false
  def changeset(encounter, attrs) do
    encounter
    |> cast(attrs, [:name, :started])
    # |> validate_required([:name, :started])
  end
end