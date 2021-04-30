#! /usr/bin/env bash

export CI=true

main() {
  run_cmd "yarn format"; format_exit=$?
  run_cmd_jest "yarn test"; test_exit=$?

  ( >&2
    echo -ne "\033[0;31m"
    [ "${format_exit}" -eq "0" ] || echo "yarn format failed"
    [ "${test_exit}" -eq "0" ] || echo "yarn test failed"
    echo -ne "\033[0m"
  )

  [[ $(( format_exit + test_exit )) -eq "0" ]]
}

run_cmd() {
    echo_cyan "> $1"

    print=$($1 2>&1 1> /dev/null)
    exit_status=$?
    if [[ ! -z "${print}" ]]; then
        echo "${print}" | sed 's/^/  /'
    fi

    return "${exit_status}"
}

run_cmd_jest() {
    # modified run_cmd for jest, because jest prints all messages to stderr
    echo_cyan "> $1"

    print=$($1 2>&1 1> /dev/null)
    exit_status=$?
    echo -n "${print}" | grep -v PASS | grep -v -E ^$ | sed 's/^/  /'

    return "${exit_status}"
}

echo_cyan() {
    echo -ne "\033[0;36m"
    echo "$1"
    echo -ne "\033[0m"
}

main