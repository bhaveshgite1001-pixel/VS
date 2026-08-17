#!/bin/bash
colors="slate gray zinc neutral stone red orange amber yellow lime green emerald teal cyan sky blue indigo violet purple fuchsia pink rose white black transparent"
echo "Color Usage Audit in src/**/*.tsx:"
for color in $colors; do
  count=$(grep -rE "(bg|text|border|ring|fill|stroke|from|to|via)-${color}-" src/ | wc -l)
  if [ "$count" -gt 0 ]; then
    echo "$color: $count"
  fi
done
