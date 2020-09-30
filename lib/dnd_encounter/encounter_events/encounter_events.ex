defmodule DndEncounter.EncounterEvents do
  @moduledoc """
  The EncounterEvents context.
  """

  import Ecto.Query, warn: false
  alias DndEncounter.Repo

  alias DndEncounter.EncounterEvents.EncounterEvent

  @doc """
  Returns the list of encounter_events.

  ## Examples

      iex> list_encounter_events()
      [%EncounterEvent{}, ...]

  """
  def list_encounter_events do
    Repo.all(EncounterEvent)
  end

  @doc """
  Gets a single encounter_event.

  Raises `Ecto.NoResultsError` if the Encounter event does not exist.

  ## Examples

      iex> get_encounter_event!(123)
      %EncounterEvent{}

      iex> get_encounter_event!(456)
      ** (Ecto.NoResultsError)

  """
  def get_encounter_event!(id), do: Repo.get!(EncounterEvent, id)

  @doc """
  Creates a encounter_event.

  ## Examples

      iex> create_encounter_event(%{field: value})
      {:ok, %EncounterEvent{}}

      iex> create_encounter_event(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_encounter_event(attrs \\ %{}) do
    %EncounterEvent{}
    |> EncounterEvent.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a encounter_event.

  ## Examples

      iex> update_encounter_event(encounter_event, %{field: new_value})
      {:ok, %EncounterEvent{}}

      iex> update_encounter_event(encounter_event, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_encounter_event(%EncounterEvent{} = encounter_event, attrs) do
    encounter_event
    |> EncounterEvent.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a encounter_event.

  ## Examples

      iex> delete_encounter_event(encounter_event)
      {:ok, %EncounterEvent{}}

      iex> delete_encounter_event(encounter_event)
      {:error, %Ecto.Changeset{}}

  """
  def delete_encounter_event(%EncounterEvent{} = encounter_event) do
    Repo.delete(encounter_event)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking encounter_event changes.

  ## Examples

      iex> change_encounter_event(encounter_event)
      %Ecto.Changeset{data: %EncounterEvent{}}

  """
  def change_encounter_event(%EncounterEvent{} = encounter_event, attrs \\ %{}) do
    EncounterEvent.changeset(encounter_event, attrs)
  end
end
