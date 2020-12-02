defmodule DndEncounterWeb.EncounterController do
  use DndEncounterWeb, :controller

  alias DndEncounter.Repo
  alias DndEncounter.Encounters
  alias DndEncounter.Encounters.Encounter

  action_fallback DndEncounterWeb.FallbackController

  def index(conn, _params) do
    encounters = Encounters.list_encounters()
    render(conn, "index.json", encounters: encounters)
  end

  def create(conn, %{"encounter" => encounter_params}) do
    with {:ok, %Encounter{} = encounter} <- Encounters.create_encounter(encounter_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.encounter_path(conn, :show, encounter))
      |> render("show.json", encounter: encounter)
    end
  end

  def show(conn, %{"id" => id}) do
    encounter =
      Encounters.get_encounter!(id)
      |> Repo.preload([:encounter_events])
    render(conn, "show.json", encounter: encounter)
  end

  def update(conn, %{"id" => id, "encounter" => encounter_params}) do
    encounter = Encounters.get_encounter!(id)

    with {:ok, %Encounter{} = encounter} <- Encounters.update_encounter(encounter, encounter_params) do
      render(conn, "show.json", encounter: encounter)
    end
  end

  def delete(conn, %{"id" => id}) do
    encounter = Encounters.get_encounter!(id)

    with {:ok, %Encounter{}} <- Encounters.delete_encounter(encounter) do
      send_resp(conn, :no_content, "")
    end
  end
end
