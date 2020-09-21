defmodule DndEncounter.Repo do
  use Ecto.Repo,
    otp_app: :dnd_encounter,
    adapter: Ecto.Adapters.Postgres
end
