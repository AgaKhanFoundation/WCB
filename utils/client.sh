#!/bin/sh

: ${EXIT_SUCCESS:=0}
: ${EXIT_FAILURE:=1}

: ${SCHEME:=https}
: ${SERVER:=akf-causes.subshell.org}

function pp() {
  python -c 'import json, sys; data = json.load(sys.stdin); print json.dumps(data, indent=2)' <<< ${*}
}

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
    if [[ ${2} =~ [0-9]+ ]] ; then
      case "${3}" in
      join-team)
        precondition "${#} -gt 3" "must have team id to join a team"
        pp $(_curl PATCH participants/${2} "{\"team_id\":\"${4}\"}")
      ;;
      leave-team)
        pp $(_curl PATCH participants/${2} "{\"team_id\":null}")
      ;;
      set-primary-cause)
        pp $(_curl PATCH participants/${2} "{\"cause_id\":${4}}")
      ;;
      esac
    else
      case "${2}" in
      create)
        precondition "${#} -gt 2" "must have participant Facebook ID to create participant"
        pp $(_curl POST participants "{\"fbid\":\"${3}\"}")
      ;;
      delete)
        precondition "${#} -gt 2" "must have participant Facebook ID to delete participant"
        _curl DELETE participants/${3}
      ;;
      query)
        precondition "${#} -gt 2" "cannot query all participants"
        pp $(_curl GET participants/${3})
      ;;
      *)
        echo >&2 unknown operation \`${2}\`
        return ${EXIT_FAILURE}
      ;;
      esac
    fi
  ;;
  team)
    case "${2}" in
    create)
      precondition "${#} -gt 2" "must have team name to create team"
      pp $(_curl POST teams "{\"name\":\"${3}\"}")
    ;;
    delete)
      precondition "${#} -gt 2" "must have team-id to delete team"
      _curl DELETE teams/${3}
    ;;
    query)
      pp $(_curl GET teams${3:+/${3}})
    ;;
    *)
      echo >&2 unknown operation \`${2}\`
      return ${EXIT_FAILURE}
    ;;
    esac
  ;;
  event)
    case "${2}" in
    create)
      precondition "${#} -eq 9" "must have event name, description, start date, end date, team limit, team building start date, team building end date to create event"
      pp $(_curl POST events "{\"name\":\"${3}\",\"description\":\"${4}\",\"start_date\":\"${5}\",\"end_date\":\"${6}\",\"team_limit\":${7},\"team_building_start\":\"${8}\",\"team_building_end\":\"${9}\"}")
    ;;
    delete)
      precondition "${#} -gt 2" "must have event-id to delete event"
      _curl DELETE events/${3}
    ;;
    query)
      pp $(_curl GET events${3:+/${3}})
    ;;
    *)
      echo >&2 unknown operation \`${2}\`
      return ${EXIT_FAILURE}
    ;;
    esac
  ;;
  cause)
    case "${2}" in
    create)
      precondition "${@} -gt 2" "must have name to create cause"
      pp $(_curl POST causes "{\"name\":\"${3}\"}")
    ;;
    delete)
      precondition "${@} -gt 2" "must have ause-id to delete cause"
      _curl DELETE causes/${3}
    ;;
    query)
      pp $(_curl GET causes${3:+/${3}})
    ;;
    esac
  ;;
  *)
    echo >&2 unknown entity \`${1}\`
    return ${EXIT_FAILURE}
  ;;
  esac
}

main "${@}"
