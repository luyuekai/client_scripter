/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package scripter.datasourse.sourceclass;

/**
 *
 * @author gloomy
 */
public class QueryInfo {

    private String sql;

    public String getSql() {
        return sql;
    }

    public void setSql(String sql) {
        this.sql = sql;
    }

    @Override
    public String toString() {
        return "QueryInfo{" + "sql=" + sql + '}';
    }

}
