# Technische Aufbereitung; für die Seminaraufgaben muss diese Datei nicht bearbeitet werden.
# Keine Analysen, Plots oder Dateiausgaben. Originaldateien bleiben unverändert.
lese_flanker <- function(data_dir) {
  packages <- c("readr", "dplyr", "tidyr")
  missing_packages <- packages[!vapply(packages, requireNamespace, logical(1), quietly = TRUE)]
  if (length(missing_packages)) stop("Bitte zuerst installieren: ", paste(missing_packages, collapse = ", "))
  suppressPackageStartupMessages({library(readr); library(dplyr); library(tidyr)})
  if (!dir.exists(data_dir)) stop("Datenordner nicht gefunden: ", data_dir)
  input_dir <- data_dir
  num <- function(x) suppressWarnings(as.numeric(x))
  flag <- function(x) { x <- tolower(trimws(as.character(x))); ifelse(x %in% c("true", "1"), TRUE, ifelse(x %in% c("false", "0"), FALSE, NA)) }
  first_value <- function(x) { x <- x[!is.na(x) & x != ""]; if (length(x)) x[1] else NA_character_ }

  files <- sort(list.files(input_dir, pattern = "\\.csv$", full.names = TRUE, ignore.case = TRUE))
  if (!length(files)) stop("Keine CSV-Dateien in: ", input_dir, ". Bitte Rohdaten dort ablegen.")
  required <- c("task", "vp_id", "session_id", "task_run_id", "trial_index", "event", "phase", "block", "trial_in_block", "congruent", "target_direction", "correct_response", "response", "rt", "correct", "omission")
  read_one <- function(file) {
    x <- read_csv(file, col_types = cols(.default = col_character()), na = c("", "NA", "null"), show_col_types = FALSE, name_repair = "check_unique")
    if (!"task" %in% names(x) || !any(x$task == "flanker", na.rm = TRUE)) { warning("Übersprungen (keine Flanker-Datei): ", basename(file)); return(NULL) }
    if (length(setdiff(required, names(x)))) stop("Fehlende Pflichtspalten in ", basename(file), ": ", paste(setdiff(required, names(x)), collapse = ", "))
    x %>% filter(task == "flanker") %>% mutate(source_file = basename(file), file_rows = n())
  }
  raw <- bind_rows(lapply(files, read_one))
  if (!nrow(raw)) stop("Keine passenden Flanker-Daten gefunden.")
  optional <- c("practice_attempt", "flanker_direction", "stimulus_text", "testing_mode", "response_window_ms", "configured_blocks", "actual_trials_per_block", "started_at", "actual_percent_congruent")
  for (name in setdiff(optional, names(raw))) raw[[name]] <- NA_character_
  keys <- c("vp_id", "session_id", "task_run_id")
  if (any(is.na(raw$vp_id) | is.na(raw$session_id) | is.na(raw$task_run_id) | is.na(num(raw$trial_index)))) stop("Leere IDs oder ungültiger trial_index: Rohdaten prüfen.")
  compare_cols <- setdiff(names(raw), c("source_file", "file_rows"))
  conflicts <- raw %>% distinct(across(all_of(compare_cols))) %>% count(across(all_of(c(keys, "trial_index")))) %>% filter(n > 1)
  if (nrow(conflicts)) stop("Widersprüchliche Exporte desselben Laufs. Bitte die Rohdateien prüfen.")
  raw <- raw %>% arrange(desc(file_rows), source_file) %>% distinct(across(all_of(c(keys, "trial_index"))), .keep_all = TRUE)
  runs <- raw %>% group_by(across(all_of(keys))) %>% summarise(
    testing_mode = flag(first_value(testing_mode)), response_window_ms = num(first_value(response_window_ms)),
    configured_blocks = num(first_value(configured_blocks)), trials_per_block = num(first_value(actual_trials_per_block)),
    started_at = first_value(started_at), source_files = paste(sort(unique(source_file)), collapse = " | "), .groups = "drop") %>%
    mutate(run_id = paste(vp_id, session_id, task_run_id, sep = "::"))
  
  trials <- raw %>% filter(event == "response") %>% transmute(
    across(all_of(keys)), source_file, jspsych_trial_index = num(trial_index), phase,
    block = num(block), trial_in_block = num(trial_in_block), practice_attempt = num(practice_attempt),
    congruent = flag(congruent), target_direction, flanker_direction, stimulus = stimulus_text,
    expected_key = tolower(correct_response), response_key = tolower(response),
    rt_ms = num(rt), recorded_correct = flag(correct), recorded_omission = flag(omission),
    percent_congruent = num(actual_percent_congruent)) %>% left_join(runs, by = keys) %>%
    arrange(vp_id, session_id, task_run_id, jspsych_trial_index) %>%
    group_by(across(all_of(keys))) %>% mutate(trial_in_run = row_number()) %>% ungroup() %>%
    mutate(congruency = factor(if_else(congruent, "congruent", "incongruent"), levels = c("congruent", "incongruent")),
      omission = is.na(response_key),
      correct = if_else(omission, FALSE, response_key == expected_key),
      accuracy = as.integer(correct),
      invalid_response = !omission & !response_key %in% c("d", "l"))
  return(trials)
}
