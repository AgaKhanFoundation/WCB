#!/bin/sh

: ${EXIT_SUCCESS:=0}
: ${EXIT_FAILURE:=1}

: ${SCHEME:=https}
: ${SERVER:=akf-causes.subshell.org}

function precondition() {
  if ! test ${1} ; then
    echo >&2 assertion failed: ${2}
    exit ${EXIT_FAILURE}
  fi
}

function _curl() {
  local method=${1} ; shift
  local endpoint=${1} ; shift
  curl --silent "${SCHEME}://${SERVER}/${endpoint}" --header "Content-Type: application/json" --request ${method} --data "${*}"
}

function main() {
  case "${1}" in
  participant)
    case "${2}" in
    create)
      _curl POST participants "{\"fbid\":\"${3}\"}"
    ;;
    delete)
      precondition "${#} -gt 2" "must have participant Facebook ID to delete participant"
      _curl DELETE participants/${3}
    ;;
    query)
      _curl GET participants${3:+/${3}}
    ;;
    *)
      echo >&2 unknown operation \`${2}\`
      return ${EXIT_FAILURE}
    ;;
    esac
  ;;
  team)
    case "${2}" in
    create)
      _curl POST teams "{\"name\":\"${3}\"}"
    ;;
    delete)
      precondition "${#} -gt 2" "must have team-id to delete team"
      _curl DELETE teams/${3}
    ;;
    query)
      _curl GET teams${3:+/${3}}
    ;;
    *)
      echo >&2 unknown operation \`${2}\`
      return ${EXIT_FAILURE}
    esac
  ;;
  *)
    echo >&2 unknown entity \`${1}\`
    return ${EXIT_FAILURE}
  ;;
  esac
  echo
}

main "${@}"
