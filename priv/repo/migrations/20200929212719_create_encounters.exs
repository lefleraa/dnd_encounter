defmodule DndEncounter.Repo.Migrations.CreateEncounters do
  use Ecto.Migration

  def change do
    create table(:encounters) do
      add :name, :string
      add :started, :boolean, default: false, null: false

      timestamps()
    end

  end
end
