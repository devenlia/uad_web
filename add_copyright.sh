#!/bin/bash

# The path to the directory where the search should begin
dir="./src"

# The copyright text for .svelte and .ts files
copyright_svelte="<!-- Copyright (C) 2023 Jannis Machowetz -->"
copyright_ts="// Copyright (C) 2023 Jannis Machowetz"

# Find all .svelte files and check them for the copyright
find $dir -name '*.svelte' | while read -r file; do
    if ! grep -q "$copyright_svelte" "$file"; then
        echo "$copyright_svelte" | cat - "$file" > temp && mv temp "$file"
    fi
done

# Find all .ts files and check them for the copyright
find $dir -name '*.ts' | while read -r file; do
    if ! grep -q "$copyright_ts" "$file"; then
        echo "$copyright_ts" | cat - "$file" > temp && mv temp "$file"
    fi
done