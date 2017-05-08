#!/bin/sh

: ${EXIT_SUCCESS:=0}
: ${EXIT_FAILURE:=1}

: ${SCHEME:=https}
: ${SERVER:=akf-causes.subshell.org}

function _curl() {
  local method=${1} ; shift
  local endpoint=${1} ; shift
  curl "${SCHEME}://${SERVER}/${endpoint}" -H "Content-Type: application/json" -X ${method} -d "${*}"
}

function main() {
  case "${1}" in
  participant)
    case "${2}" in
    create)
      _curl POST participants "{\"fbid\":\"${3}\"}"
    ;;
    delete)
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
