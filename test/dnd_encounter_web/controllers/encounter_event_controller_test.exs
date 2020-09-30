defmodule DndEncounterWeb.EncounterEventControllerTest do
  use DndEncounterWeb.ConnCase

  alias DndEncounter.EncounterEvents
  alias DndEncounter.EncounterEvents.EncounterEvent

  @create_attrs %{

  }
  @update_attrs %{

  }
  @invalid_attrs %{}

  def fixture(:encounter_event) do
    {:ok, encounter_event} = EncounterEvents.create_encounter_event(@create_attrs)
    encounter_event
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all encounter_events", %{conn: conn} do
      conn = get(conn, Routes.encounter_event_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create encounter_event" do
    test "renders encounter_event when data is valid", %{conn: conn} do
      conn = post(conn, Routes.encounter_event_path(conn, :create), encounter_event: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.encounter_event_path(conn, :show, id))

      assert %{
               "id" => id
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.encounter_event_path(conn, :create), encounter_event: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update encounter_event" do
    setup [:create_encounter_event]

    test "renders encounter_event when data is valid", %{conn: conn, encounter_event: %EncounterEvent{id: id} = encounter_event} do
      conn = put(conn, Routes.encounter_event_path(conn, :update, encounter_event), encounter_event: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.encounter_event_path(conn, :show, id))

      assert %{
               "id" => id
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, encounter_event: encounter_event} do
      conn = put(conn, Routes.encounter_event_path(conn, :update, encounter_event), encounter_event: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete encounter_event" do
    setup [:create_encounter_event]

    test "deletes chosen encounter_event", %{conn: conn, encounter_event: encounter_event} do
      conn = delete(conn, Routes.encounter_event_path(conn, :delete, encounter_event))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.encounter_event_path(conn, :show, encounter_event))
      end
    end
  end

  defp create_encounter_event(_) do
    encounter_event = fixture(:encounter_event)
    %{encounter_event: encounter_event}
  end
end
