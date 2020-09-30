defmodule DndEncounterWeb.EncounterControllerTest do
  use DndEncounterWeb.ConnCase

  alias DndEncounter.Encounters
  alias DndEncounter.Encounters.Encounter

  @create_attrs %{

  }
  @update_attrs %{

  }
  @invalid_attrs %{}

  def fixture(:encounter) do
    {:ok, encounter} = Encounters.create_encounter(@create_attrs)
    encounter
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all encounters", %{conn: conn} do
      conn = get(conn, Routes.encounter_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create encounter" do
    test "renders encounter when data is valid", %{conn: conn} do
      conn = post(conn, Routes.encounter_path(conn, :create), encounter: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.encounter_path(conn, :show, id))

      assert %{
               "id" => id
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.encounter_path(conn, :create), encounter: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update encounter" do
    setup [:create_encounter]

    test "renders encounter when data is valid", %{conn: conn, encounter: %Encounter{id: id} = encounter} do
      conn = put(conn, Routes.encounter_path(conn, :update, encounter), encounter: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.encounter_path(conn, :show, id))

      assert %{
               "id" => id
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, encounter: encounter} do
      conn = put(conn, Routes.encounter_path(conn, :update, encounter), encounter: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete encounter" do
    setup [:create_encounter]

    test "deletes chosen encounter", %{conn: conn, encounter: encounter} do
      conn = delete(conn, Routes.encounter_path(conn, :delete, encounter))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.encounter_path(conn, :show, encounter))
      end
    end
  end

  defp create_encounter(_) do
    encounter = fixture(:encounter)
    %{encounter: encounter}
  end
end
