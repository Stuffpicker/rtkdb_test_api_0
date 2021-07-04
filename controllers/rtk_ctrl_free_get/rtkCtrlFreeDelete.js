module.exports =function rtkCtrlFreeDelete(r, connectRethinkdb, S_Get_split_length, request, res){
    if (["del", "delete", "d", "remove"].includes(S_Get_split_length[0])) {
        S_Get_split_length = S_Get_split_length.filter((_,i)=> i !==0)
                 switch (S_Get_split_length) {
                /* case 1 - select list de table dans une bd. ie path = /couturetestdb -> ['couturetestdb'] */
                case 1:
                    connectRethinkdb()
                        .then((_) => {
                            //console.log("le _ :"); console.log(_);
                            r.db(S_Get[0])
                                .tableList()
                                .run(_, function (err, result) {
                                    if (err) {
                                        return res?.end(
                                            JSON.stringify(
                                                Object.assign({ valid: "no", what: "error case 1-0" }, err)
                                            )
                                        );
                                    }
                                    return res?.end(
                                        JSON.stringify(
                                            [Object.assign(
                                                { valid: "yes", what: "Table List" },
                                                { result }),
                                            ], null, 2
                                        )
                                    );
                                })
                        })
                        .catch((e) =>
                            res?.end(
                                JSON.stringify(Object.assign({ valid: "no", what: "error case 1-1 final" }, e))
                            )
                        );
                    break;
                /* case 2 - select tous les elements d'une table dans une bd. 
                 ex pour path = /nom_base_de_donnee/nom_table -> ['couturetestdb','nom_table'] */
                case 2:
                    connectRethinkdb()
                        .then((_) => {
                            r.db(S_Get[0])
                                .table(S_Get[1])
                                .run(_, function (err, cursor) {
                                    if (err) {
                                        return res.end(
                                            JSON.stringify(
                                                Object.assign({ valid: "no", what: "error case 2-0" }, err)
                                            )
                                        );
                                    }
                                    if (cursor) {
                                        cursor.toArray(function (err, result) {
                                            if (err) {
                                                res?.end(
                                                    JSON.stringify(
                                                        Object.assign({ valid: "no", what: "error case 2-1 " }, err)
                                                    )
                                                ); return;
                                            }
                                            res?.end(JSON.stringify(result, null, 2));
                                            return;
                                        });
                                    }
                                })
                        })
                        .catch((e) =>
                            res?.end(
                                JSON.stringify(Object.assign({ valid: "no", what: "error case 2-catch final" }, e))
                            )
                        );
                    break;
                //case 3
                case 3:
                    if (S_Get[2].startsWith('getField__')) {
                        // ie: http://localhost:8181/go/users/getField__email
                        S_Get[2] = S_Get[2].replace('getField__', '')
                        connectRethinkdb()
                            .then((_) => {
                                r.db(S_Get[0])
                                    .table(S_Get[1])
                                    .getField(S_Get[2])
                                    .run(_, function (err, cursor) {
                                        if (err) {
                                            return res?.end(
                                                JSON.stringify(
                                                    Object.assign({ valid: "no", what: "error case 3-0" }, err)
                                                )
                                            );
                                        }
                                        if (cursor) {
                                            cursor.toArray(function (err, result) {
                                                if (err) {
                                                    res?.end(
                                                        JSON.stringify(
                                                            Object.assign({ valid: "no", what: "error case 3-1 " }, err)
                                                        )
                                                    ); return;
                                                }
                                                res?.end(JSON.stringify(result, null, 2));
                                                return;
                                            });
                                        }
                                    })
                            })
                            .catch((e) =>
                                res?.end(
                                    JSON.stringify(Object.assign({ valid: "no", what: "error final case 3-catch" }, e))
                                )
                            )
                    }
                    else if (["filter", "f", "fi"].includes(S_Get[2].split("___")[0])) {
                        // ie:http://localhost:8181/go/users/f___nom___dola
                        connectRethinkdb()
                            .then((_) => {
                                r.db(S_Get[0])
                                    .table(S_Get[1])
                                    .filter(
                                        r.row(S_Get[2].split("___")[1]).eq(S_Get[2].split("___")[2])
                                    )
                                    .run(_, function (err, cursor) {
                                        if (err) {
                                            res.end(
                                                JSON.stringify(
                                                    Object.assign({ valid: "no", what: "error 1-6-0" }, err)
                                                )
                                            );
                                        }
                                        cursor.toArray(function (err, result) {
                                            if (err) {
                                                res.end(
                                                    JSON.stringify(
                                                        Object.assign({ valid: "no", what: "error 1-7-0" }, err)
                                                    )
                                                );
                                            }
                                            res.end(JSON.stringify(result, null, 2));
                                            //process.exit(1);)
                                        });
                                    });
                            })
                            .catch((e) =>
                                res.end(
                                    JSON.stringify(Object.assign({ valid: "no", what: "error final" }, e))
                                )
                            )
                        break;

                    }

                    else {
                        connectRethinkdb()
                            .then((_) => {

                                r.db(S_Get[0])
                                    .table(S_Get[1])
                                    .get(S_Get[2])
                                    .run(_, function (err, result) {
                                        if (err) {
                                            res.end(
                                                JSON.stringify(
                                                    Object.assign({ valid: "no", what: "error case 3-else" }, err)
                                                ),
                                                null,
                                                2
                                            );
                                        }
                                        res.end(JSON.stringify(result, null, 2));
                                        //process.exit(1);  
                                    })
                            })
                            .catch((e) =>
                                res.end(
                                    JSON.stringify(Object.assign({ valid: "no", what: "error final" }, e))
                                )
                            )

                    }
                    break;
                // case 4 
                case 4:
                    connectRethinkdb()
                        .then((_) => {
                            r.db(S_Get[0])
                                .table(S_Get[1])
                                .run(_, function (err, cursor) {
                                    if (err) {
                                        return res.end(
                                            JSON.stringify(
                                                Object.assign({ valid: "no", what: "error 1-0" }, err)
                                            )
                                        );
                                    }
                                    if (cursor) {
                                        cursor.toArray(function (err, result) {
                                            if (err) {
                                                res.end(
                                                    JSON.stringify(
                                                        Object.assign({ valid: "no", what: "error 1-2" }, err)
                                                    )
                                                ); return;
                                            }
                                            res.end(JSON.stringify(result, null, 2));
                                            return;
                                        });
                                    }
                                })
                        }).catch((e) =>
                            res.end(
                                JSON.stringify(Object.assign({ valid: "no", what: "error final" }, e))
                            )
                        );
                    break;
                //DEFAULT
                default:
                    res.end(
                        JSON.stringify(Object.assign({ valid: "no", what: "error final" }, {}))
                    )
            }
        }
    else{}
}