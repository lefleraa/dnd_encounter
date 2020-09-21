# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :dnd_encounter,
  ecto_repos: [DndEncounter.Repo]

# Configures the endpoint
config :dnd_encounter, DndEncounterWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "rybDll47scIJzrqv8MN1gxjvPfkmxRooRDMswINJPHdZWbiKp2OPKo8CHBjxcGeW",
  render_errors: [view: DndEncounterWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: DndEncounter.PubSub,
  live_view: [signing_salt: "zEgokA8x"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
