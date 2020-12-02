defmodule DndEncounter.Repo.Migrations.CreateEncounterEvents do
  use Ecto.Migration

  def change do
    create table(:encounter_events) do
      add :type, :string
      add :payload, :map
      add :archive, :boolean, default: false, null: false
      add :encounter_id, references(:encounters)

      timestamps()
    end

  end
end