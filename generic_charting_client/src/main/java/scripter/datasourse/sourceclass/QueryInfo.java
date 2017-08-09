/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package scripter.datasourse.sourceclass;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import kg.auth.utils.JsonUtil;

/**
 *
 * @author gloomy
 */
public class QueryInfo {

    private String sql;
    private String dbName;

    public String getSql() {
        return sql;
    }

    public void setSql(String sql) {
        this.sql = sql;
    }

    public String getdbName() {
        return dbName;
    }

    public void setdbName(String dbName) {
        this.dbName = dbName;
    }

    @Override
    public String toString() {
        return "QueryInfo{" + "sql=" + sql + '}';
    }


}
