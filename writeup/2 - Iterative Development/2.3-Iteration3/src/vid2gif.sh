#!/bin/bash

input_file="$1"
output_file="${input_file%.*}.gif"

# Convert video to GIF using ffmpeg
ffmpeg -i "$input_file" \
    -filter_complex "[0:v] fps=24,scale=1000:-1,split [a][b];[a] palettegen [p];[b][p] paletteuse" \
    "$output_file"
