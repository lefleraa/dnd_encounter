defmodule DndEncounter.Repo.Migrations.CreateEncounterevents do
  use Ecto.Migration

  def change do
    create table(:encounter_events) do
      add :type, :string
      add :payload, :jsonb

      timestamps()
    end

  end
end
