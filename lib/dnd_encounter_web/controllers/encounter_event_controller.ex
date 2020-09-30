defmodule DndEncounterWeb.EncounterEventController do
  use DndEncounterWeb, :controller

  alias DndEncounter.EncounterEvents
  alias DndEncounter.EncounterEvents.EncounterEvent

  action_fallback DndEncounterWeb.FallbackController

  def index(conn, _params) do
    encounter_events = EncounterEvents.list_encounter_events()
    render(conn, "index.json", encounter_events: encounter_events)
  end

  def create(conn, %{"encounter_event" => encounter_event_params}) do
    with {:ok, %EncounterEvent{} = encounter_event} <- EncounterEvents.create_encounter_event(encounter_event_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.encounter_event_path(conn, :show, encounter_event))
      |> render("show.json", encounter_event: encounter_event)
    end
  end

  def show(conn, %{"id" => id}) do
    encounter_event = EncounterEvents.get_encounter_event!(id)
    render(conn, "show.json", encounter_event: encounter_event)
  end

  def update(conn, %{"id" => id, "encounter_event" => encounter_event_params}) do
    encounter_event = EncounterEvents.get_encounter_event!(id)

    with {:ok, %EncounterEvent{} = encounter_event} <- EncounterEvents.update_encounter_event(encounter_event, encounter_event_params) do
      render(conn, "show.json", encounter_event: encounter_event)
    end
  end

  def delete(conn, %{"id" => id}) do
    encounter_event = EncounterEvents.get_encounter_event!(id)

    with {:ok, %EncounterEvent{}} <- EncounterEvents.delete_encounter_event(encounter_event) do
      send_resp(conn, :no_content, "")
    end
  end
end
