defmodule DndEncounter.EncounterEventsTest do
  use DndEncounter.DataCase

  alias DndEncounter.EncounterEvents

  describe "encounter_events" do
    alias DndEncounter.EncounterEvents.EncounterEvent

    @valid_attrs %{}
    @update_attrs %{}
    @invalid_attrs %{}

    def encounter_event_fixture(attrs \\ %{}) do
      {:ok, encounter_event} =
        attrs
        |> Enum.into(@valid_attrs)
        |> EncounterEvents.create_encounter_event()

      encounter_event
    end

    test "list_encounter_events/0 returns all encounter_events" do
      encounter_event = encounter_event_fixture()
      assert EncounterEvents.list_encounter_events() == [encounter_event]
    end

    test "get_encounter_event!/1 returns the encounter_event with given id" do
      encounter_event = encounter_event_fixture()
      assert EncounterEvents.get_encounter_event!(encounter_event.id) == encounter_event
    end

    test "create_encounter_event/1 with valid data creates a encounter_event" do
      assert {:ok, %EncounterEvent{} = encounter_event} = EncounterEvents.create_encounter_event(@valid_attrs)
    end

    test "create_encounter_event/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = EncounterEvents.create_encounter_event(@invalid_attrs)
    end

    test "update_encounter_event/2 with valid data updates the encounter_event" do
      encounter_event = encounter_event_fixture()
      assert {:ok, %EncounterEvent{} = encounter_event} = EncounterEvents.update_encounter_event(encounter_event, @update_attrs)
    end

    test "update_encounter_event/2 with invalid data returns error changeset" do
      encounter_event = encounter_event_fixture()
      assert {:error, %Ecto.Changeset{}} = EncounterEvents.update_encounter_event(encounter_event, @invalid_attrs)
      assert encounter_event == EncounterEvents.get_encounter_event!(encounter_event.id)
    end

    test "delete_encounter_event/1 deletes the encounter_event" do
      encounter_event = encounter_event_fixture()
      assert {:ok, %EncounterEvent{}} = EncounterEvents.delete_encounter_event(encounter_event)
      assert_raise Ecto.NoResultsError, fn -> EncounterEvents.get_encounter_event!(encounter_event.id) end
    end

    test "change_encounter_event/1 returns a encounter_event changeset" do
      encounter_event = encounter_event_fixture()
      assert %Ecto.Changeset{} = EncounterEvents.change_encounter_event(encounter_event)
    end
  end
end
