defmodule DndEncounter.Encounters do
  @moduledoc """
  The Encounters context.
  """

  import Ecto.Query, warn: false
  alias DndEncounter.Repo

  alias DndEncounter.Encounters.Encounter

  @doc """
  Returns the list of encounters.

  ## Examples

      iex> list_encounters()
      [%Encounter{}, ...]

  """
  def list_encounters do
    Repo.all(Encounter)
  end

  @doc """
  Gets a single encounter.

  Raises `Ecto.NoResultsError` if the Encounter does not exist.

  ## Examples

      iex> get_encounter!(123)
      %Encounter{}

      iex> get_encounter!(456)
      ** (Ecto.NoResultsError)

  """
  def get_encounter!(id) do
    event = Repo.get!(Encounter, id)
  end

  @doc """
  Creates a encounter.

  ## Examples

      iex> create_encounter(%{field: value})
      {:ok, %Encounter{}}

      iex> create_encounter(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_encounter(attrs \\ %{}) do
    %Encounter{}
    |> Encounter.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a encounter.

  ## Examples

      iex> update_encounter(encounter, %{field: new_value})
      {:ok, %Encounter{}}

      iex> update_encounter(encounter, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_encounter(%Encounter{} = encounter, attrs) do
    encounter
    |> Encounter.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a encounter.

  ## Examples

      iex> delete_encounter(encounter)
      {:ok, %Encounter{}}

      iex> delete_encounter(encounter)
      {:error, %Ecto.Changeset{}}

  """
  def delete_encounter(%Encounter{} = encounter) do
    Repo.delete(encounter)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking encounter changes.

  ## Examples

      iex> change_encounter(encounter)
      %Ecto.Changeset{data: %Encounter{}}

  """
  def change_encounter(%Encounter{} = encounter, attrs \\ %{}) do
    Encounter.changeset(encounter, attrs)
  end
end
