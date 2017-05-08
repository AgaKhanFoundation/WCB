#!/bin/sh

: ${EXIT_SUCCESS:=0}
: ${EXIT_FAILURE:=1}

: ${SCHEME:=https}
: ${SERVER:=akf-causes.subshell.org}

function post() {
  local endpoint=${1}
  shift
  curl "${SCHEME}://${SERVER}/${endpoint}" -H "Content-Type: application/json" -X POST -d "${*}"
}

function main() {
  case "${1}" in
  participant)
    case "${2}" in
    create)
      post participants "{\"fbid\":\"${3}\"}"
    ;;
    delete)
    ;;
    *)
      echo >&2 unknown operation ${2}
      return ${EXIT_FAILURE}
    ;;
    esac
  ;;
  team)
    case "${2}" in
    create)
      post teams "{\"name\":\"${3}\"}"
    ;;
    delete)
    ;;
    *)
      echo >&2 unknown operation ${2}
      return ${EXIT_FAILURE}
    esac
  ;;
  esac
  echo
}

main "${@}"
