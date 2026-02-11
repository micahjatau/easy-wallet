# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Changelog automation tooling with `standard-version`.
- Conventional Commit validation with `commitlint`.
- Release scripts for patch, minor, major, and dry-run flows.
- Regression tests for audit log filtering, expansion reset on filter change, and pagination behavior.

### Changed

- Release workflow now derives notes from commit history.
- Audit log UI now defaults to a filter-first view to reduce noise and requires selecting an action before entries are shown.
- App header now removes sync/date text metadata, and dark mode toggle is placed before backup status controls.

### Fixed

- N/A

### Security

- N/A
