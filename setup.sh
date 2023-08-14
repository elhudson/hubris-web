source .env/bin/activate
export NOTION_DB="0e2c8717f10341a2a2d30f48eb2c6677"
export NOTION_TOKEN="secret_oPnTR8UwwPWeDeJReXH7rZwRb2ILunhXd35AQOn2xmY"
export PROJECT_PATH=$PWD
flask --app HUBRIS run --debug & npm run watch && fg
