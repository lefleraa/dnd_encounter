defmodule DndEncounterWeb.Router do
  use DndEncounterWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api/v1", DndEncounterWeb do
      pipe_through :api

      get "/encounters", EncounterController, :index
      post "/encounters", EncounterController, :create
      get "/encounters/:id", EncounterController, :show
      delete "/encounters/:id", EncounterController, :delete
    end

  scope "/", DndEncounterWeb do
    pipe_through :browser

    get "/*path", PageController, :index
  end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  # if Mix.env() in [:dev, :test] do
  #   import Phoenix.LiveDashboard.Router

  #   scope "/" do
  #     pipe_through :browser
  #     live_dashboard "/dashboard", metrics: DndEncounterWeb.Telemetry
  #   end
  # end
end
