/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package scripter.datasourse.sourceclass;

import com.alibaba.fastjson.JSON;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ws.rs.core.Response;
import v2.service.generic.library.constants.GenericStatus;
import v2.service.generic.library.model.ResponsePOJO;
import v2.service.generic.library.utils.JsonUtil;

/**
 *
 * @author gloomy
 */
public class SqlService {

    static final Logger logger = Logger.getLogger("scripter.database.SqlService");

    private final Connection connection;
    private final DatabaseConnection databaseConnection;

    public SqlService(Connection connection) {
        this.connection = connection;
        this.databaseConnection = null;
    }

    public SqlService(DatabaseConnection databaseConnection) {
        this.connection = null;
        this.databaseConnection = databaseConnection;
    }

    public Response testConnection() throws SQLException {
        Connection con = null;
        ResponsePOJO response = new ResponsePOJO();
//        SqlResult sqlResult = new SqlResult(403, "Error");
        try {

            Class.forName(databaseConnection.getDbDriver());
            con = DriverManager.getConnection(databaseConnection.getDbUrl(), databaseConnection.getDbUsername(), databaseConnection.getDbPasswd());
            if (con != null) {
                Statement st = con.createStatement();
                String sql = "select schema_name from information_schema.schemata where schema_name"
                        + " NOT LIKE 'pg_%' AND schema_name != 'information_schema' AND schema_owner = '" + databaseConnection.getDbUsername() + "'";
                ResultSet rs = st.executeQuery(sql);
                String result = result2String(rs);
                List result_list = new ArrayList();
                result_list.add(result);
                response.setHasError(Boolean.FALSE);
                response.setStatusCode(GenericStatus.Service_Successed);
                response.setResult(result_list);
//                sqlResult.setData(result2String(rs));
//                sqlResult.setStatus(200);
            } else {
//                sqlResult.setData("连接失败");
                response.setHasError(Boolean.TRUE);
                response.setStatusCode(GenericStatus.Service_Failed);
            }
        } catch (Exception e) {
//            sqlResult.setData("连接失败");
//            sqlResult.setInfo(e.toString());
            response.setHasError(Boolean.TRUE);
            response.setStatusCode(GenericStatus.Service_Failed);
            response.setErrorMessage(e.getMessage());
            e.printStackTrace();
        } finally {
            if (con != null) {
                con.close();
            }
        }

        String outjson = JSON.toJSONString(response);
        return Response.status(200).entity(outjson).build();
    }

    public String executeQuery(String sql) throws IOException {
        ResponsePOJO response = new ResponsePOJO();
        try {
            if (connection != null) {
                logger.info("创建连接成功");
                Statement st = connection.createStatement();
                ResultSet rs = st.executeQuery(sql);
                String result = result2String(rs);
                List result_list = new ArrayList();
                result_list.add(result);
                response.setHasError(Boolean.FALSE);
                response.setStatusCode(GenericStatus.Service_Successed);
                response.setResult(result_list);
            } else {
                response.setHasError(Boolean.TRUE);
                response.setStatusCode(GenericStatus.Service_Failed);
            }

        } catch (Exception e) {
            logger.warning("executeQuery Exception" + e.getMessage());
            if ("查询没有传回任何结果。".equals(e.getMessage())) {
                response.setHasError(Boolean.FALSE);
                response.setStatusCode(GenericStatus.Service_Successed);
            }
            response.setHasError(Boolean.TRUE);
            response.setStatusCode(GenericStatus.Service_Failed);
            response.setErrorMessage(e.getMessage());
        }
        return JsonUtil.toJson(response);
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
