# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "unstable"; # Using unstable to get a newer firebase-tools version

  # Use https://search.nixos.org/packages to find packages
  packages = [
    # Wir brauchen Node.js und den Paketmanager npm für Web-Entwicklung
    pkgs.nodejs_20

    # Die Firebase Command Line Tools, um mit Firebase zu interagieren
    pkgs.firebase-tools

    # Git für die Versionskontrolle
    pkgs.git
  ];

  # Sets environment variables in the workspace
  env = {};
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
    ];
  };
}
