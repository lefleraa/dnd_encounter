defmodule DndEncounterWeb.EncountersController do
  use DndEncounterWeb, :controller

  def index(conn, _params) do
    encounters = [
      %{encounter_id: "dbdc750d-6747-4fe4-a09a-00c15a026593",
        name: "Battle at the Banks",
        started: true},
      %{encounter_id: "f44f4d88-aff6-4a1d-bd59-719f5248b6a6",
        name: "The Eye of Sauron",
        started: false},
      %{encounter_id: "eaad99d0-94be-443d-bdcf-9a1f0c93f8ce",
        name: "Big Baddie",
        started: false},
    ]

    json conn, encounters
  end
end