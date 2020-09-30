defmodule DndEncounter.EncountersTest do
  use DndEncounter.DataCase

  alias DndEncounter.Encounters

  describe "encounters" do
    alias DndEncounter.Encounters.Encounter

    @valid_attrs %{}
    @update_attrs %{}
    @invalid_attrs %{}

    def encounter_fixture(attrs \\ %{}) do
      {:ok, encounter} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Encounters.create_encounter()

      encounter
    end

    test "list_encounters/0 returns all encounters" do
      encounter = encounter_fixture()
      assert Encounters.list_encounters() == [encounter]
    end

    test "get_encounter!/1 returns the encounter with given id" do
      encounter = encounter_fixture()
      assert Encounters.get_encounter!(encounter.id) == encounter
    end

    test "create_encounter/1 with valid data creates a encounter" do
      assert {:ok, %Encounter{} = encounter} = Encounters.create_encounter(@valid_attrs)
    end

    test "create_encounter/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Encounters.create_encounter(@invalid_attrs)
    end

    test "update_encounter/2 with valid data updates the encounter" do
      encounter = encounter_fixture()
      assert {:ok, %Encounter{} = encounter} = Encounters.update_encounter(encounter, @update_attrs)
    end

    test "update_encounter/2 with invalid data returns error changeset" do
      encounter = encounter_fixture()
      assert {:error, %Ecto.Changeset{}} = Encounters.update_encounter(encounter, @invalid_attrs)
      assert encounter == Encounters.get_encounter!(encounter.id)
    end

    test "delete_encounter/1 deletes the encounter" do
      encounter = encounter_fixture()
      assert {:ok, %Encounter{}} = Encounters.delete_encounter(encounter)
      assert_raise Ecto.NoResultsError, fn -> Encounters.get_encounter!(encounter.id) end
    end

    test "change_encounter/1 returns a encounter changeset" do
      encounter = encounter_fixture()
      assert %Ecto.Changeset{} = Encounters.change_encounter(encounter)
    end
  end
end
