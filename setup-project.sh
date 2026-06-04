#!/bin/bash

mkdir -p src/components
mkdir -p src/pages
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/utils
mkdir -p src/data

mkdir -p public/images/services
mkdir -p public/descriptions

mkdir -p scripts
mkdir -p generated
mkdir -p config

touch config/settings.json

touch scripts/build_json.py
touch scripts/excel_reader.py
touch scripts/hierarchy_builder.py
touch scripts/validators.py

touch generated/.gitkeep

