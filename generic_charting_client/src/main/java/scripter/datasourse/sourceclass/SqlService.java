/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package scripter.datasourse.sourceclass;

import com.alibaba.fastjson.JSON;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ws.rs.core.Response;

/**
 *
 * @author gloomy
 */
public class SqlService {

    static final Logger logger = Logger.getLogger("scripter.database.SqlService");

    private DatabaseConnection databaseConnection;

    public SqlService(DatabaseConnection databaseConnection) {
        this.databaseConnection = databaseConnection;
    }

    public Response testConnection() throws SQLException {
        Connection con = null;
        SqlResult sqlResult = new SqlResult(403, "Error");
        try {

            Class.forName(databaseConnection.getDbDriver());
            con = DriverManager.getConnection(databaseConnection.getDbUrl(), databaseConnection.getDbUsername(), databaseConnection.getDbPasswd());
            if (con != null) {
                Statement st = con.createStatement();
                String sql = "select schema_name from information_schema.schemata where schema_name"
                        + " NOT LIKE 'pg_%' AND schema_name != 'information_schema' AND schema_owner = '" + databaseConnection.getDbUsername() + "'";
                ResultSet rs = st.executeQuery(sql);
                sqlResult.setData(result2String(rs));
                sqlResult.setStatus(200);
            } else {
                sqlResult.setData("连接失败");
            }
        } catch (Exception e) {
            sqlResult.setData("连接失败");
            sqlResult.setInfo(e.toString());
            e.printStackTrace();
        } finally {
            if (con != null) {
                con.close();
            }
        }

        String outjson = JSON.toJSONString(sqlResult);
        return Response.status(200).entity(outjson).build();
    }
    
        public Response executeQuery(String sql) {
        Connection con = null;
        SqlResult sqlResult = new SqlResult(403, "");
        try {
            Class.forName(databaseConnection.getDbDriver());
            con = DriverManager.getConnection(databaseConnection.getDbUrl(), databaseConnection.getDbUsername(), databaseConnection.getDbPasswd());
            if (con != null) {
                logger.info("创建连接成功");
                Statement st = con.createStatement();
                ResultSet rs = st.executeQuery(sql);
                String result = result2String(rs);
                sqlResult.setHasQueryResultData(true);
                sqlResult.setStatus(200);
                sqlResult.setData(result);
            } else {
                sqlResult.setData("连接失败");
            }

        } catch (Exception e) {
            logger.warning("executeQuery Exception" + e.getMessage());
            if ("查询没有传回任何结果。".equals(e.getMessage())) {
                sqlResult.setHasQueryResultData(false);
                sqlResult.setStatus(200);
            }
            sqlResult.setData("失败");
            sqlResult.setInfo(e.getMessage());
        } finally {
            try {
                con.close();
            } catch (SQLException ex) {
                Logger.getLogger(SqlService.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        String outjson = JSON.toJSONString(sqlResult);
        return Response.status(200).entity(outjson).build();
    }

    private static String result2String(ResultSet res) throws SQLException {
        ResultSetMetaData resultSetMetaData = res.getMetaData();
        String result = "";
        //get table metadata
        for (int i = 1; i <= resultSetMetaData.getColumnCount(); i++) {
            result += resultSetMetaData.getColumnName(i);
            if (i < resultSetMetaData.getColumnCount()) {
                result += ",";
            }
        }
        result += "\n";
        //get table data

        int n = 0;
        while (res.next()) {
            for (int i = 1; i <= resultSetMetaData.getColumnCount(); i++) {
                result += res.getString(i);
                if (i < resultSetMetaData.getColumnCount()) {
                    result += ",";
                }
            }
            result += "\n";
            n++;
            if (n > 10000) {
                break;
            }
        }
        return result;
    }
}
