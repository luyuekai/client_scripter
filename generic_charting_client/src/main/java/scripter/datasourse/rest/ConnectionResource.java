/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package scripter.datasourse.rest;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Produces;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;
import scripter.datasourse.sourceclass.ConnectionManager;
import scripter.datasourse.sourceclass.DatabaseConnection;
import scripter.datasourse.sourceclass.QueryInfo;
import scripter.datasourse.sourceclass.SqlService;
import v2.service.generic.library.utils.JsonUtil;

/**
 * REST Web Service
 *
 * @author gloomy
 */
@Path("connection")
public class ConnectionResource {

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of ConnectionResource
     */
    public ConnectionResource() {

    }

    @POST
    @Path("testconnection")
    @Produces("application/json")
    public Response testConnection(@FormParam("DBConfig") String DBConfig) throws IOException, SQLException {

        DatabaseConnection dbConnection = (DatabaseConnection) JsonUtil.toPojo(DBConfig, DatabaseConnection.class);
        SqlService sqlService = new SqlService(dbConnection);
        return sqlService.testConnection();
    }

    @POST
    @Path("schemas")
    @Produces({"application/json"})
    public String getSchema(@FormParam("DBName") String DBName) throws IOException {
        ConnectionManager connectionManager = ConnectionManager.getInstance();
        Connection con = connectionManager.getConnection(DBName);
        String sql = "select schema_name ,schema_owner from information_schema.schemata where schema_name"
                + " NOT LIKE 'pg_%' AND schema_name != 'information_schema'";
        SqlService sqlService = new SqlService(con);

        return sqlService.executeQuery(sql);

    }

    @POST
    @Path("{schema}/tables")
    @Produces({"application/json"})
    public String getTablesInSchema(@FormParam("DBName") String DBName, @PathParam("schema") String schema) throws IOException {
        ConnectionManager connectionManager = ConnectionManager.getInstance();
        Connection con = connectionManager.getConnection(DBName);
        String sql = "SELECT tablename FROM pg_tables  WHERE  schemaname = '" + schema
                + "'AND tablename NOT LIKE 'pg%' AND tablename NOT LIKE 'sql_%' ORDER BY tablename;";
        SqlService sqlService = new SqlService(con);
        return sqlService.executeQuery(sql);
    }

    @POST
    @Path("{schema}/{table}/columns")
    @Produces({"application/json"})
    public String getColumnsInTable(@FormParam("DBName") String DBName, @PathParam("schema") String schema, @PathParam("table") String table) throws IOException {
        ConnectionManager connectionManager = ConnectionManager.getInstance();
        Connection con = connectionManager.getConnection(DBName);
        String sql = "SELECT column_name FROM information_schema.columns  WHERE  table_schema = '" + schema
                + "'AND table_name = '" + table + "'";
        SqlService sqlService = new SqlService(con);
        return sqlService.executeQuery(sql);
    }

    @POST
    @Path("query")
    @Produces({"application/json"})
    public String executeQuery(@FormParam("DBName") String DBName, @FormParam("queryInfo") String queryInfo) throws IOException {   //每次都要传DBconfig,因为每次选择源的时候数据库可能会变
        ConnectionManager connectionManager = ConnectionManager.getInstance();
        Connection con = connectionManager.getConnection(DBName);
        QueryInfo sqlInfo = JsonUtil.toPojo(queryInfo, QueryInfo.class);
        String sql = sqlInfo.getSql();
        SqlService sqlService = new SqlService(con);
        return sqlService.executeQuery(sql);
    }

    @POST
    @Path("addconnection")
    @Produces({"application/json"})
    public String addConnection(@FormParam("DBConfig") String DBConfig) throws IOException {
        DatabaseConnection dbConnection = (DatabaseConnection) JsonUtil.toPojo(DBConfig, DatabaseConnection.class);
        ConnectionManager connectionManager = ConnectionManager.getInstance();
        connectionManager.addConnection(dbConnection);
        return null;
    }

    @POST
    @Path("updateconnection")
    @Produces({"application/json"})
    public String updateConnection(@FormParam("DBConfig") String DBConfig, @FormParam("DBName") String DBName) {
        return null;
    }

    @POST
    @Path("deleteconnection")
    @Produces({"application/json"})
    public String deleteConnection(@FormParam("DBName") String DBName) {
        return null;
    }

}
