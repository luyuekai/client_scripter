/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package scripter.datasourse.rest;

import com.alibaba.fastjson.JSON;
import java.io.IOException;
import java.sql.SQLException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import scripter.datasourse.sourceclass.DatabaseConnection;
import scripter.datasourse.sourceclass.QueryInfo;
import scripter.datasourse.sourceclass.SqlResult;
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
    public Response GetSchema(@FormParam("DBConfig") String DBConfig) throws IOException {

        DatabaseConnection dbConnection = (DatabaseConnection) JsonUtil.toPojo(DBConfig, DatabaseConnection.class);
        String sql = "select schema_name ,schema_owner from information_schema.schemata where schema_name"
                + " NOT LIKE 'pg_%' AND schema_name != 'information_schema'";
        SqlService sqlService = new SqlService(dbConnection);

        return sqlService.executeQuery(sql);

    }

    @POST
    @Path("{schema}/tables")
    @Produces({"application/json"})
    public Response GetTablesInSchema(@FormParam("DBConfig") String DBConfig, @PathParam("schema") String schema) throws IOException {
        DatabaseConnection dbConnection = (DatabaseConnection) JsonUtil.toPojo(DBConfig, DatabaseConnection.class);
        String sql = "SELECT tablename FROM pg_tables  WHERE  schemaname = '" + schema
                + "'AND tablename NOT LIKE 'pg%' AND tablename NOT LIKE 'sql_%' ORDER BY tablename;";
        SqlService sqlService = new SqlService(dbConnection);
        return sqlService.executeQuery(sql);
    }

    @POST
    @Path("{schema}/{table}/columns")
    @Produces({"application/json"})
    public Response GetColumnsInTable(@FormParam("DBConfig") String DBConfig, @PathParam("schema") String schema, @PathParam("table") String table) throws IOException {
        DatabaseConnection dbConnection = (DatabaseConnection) JsonUtil.toPojo(DBConfig, DatabaseConnection.class);
        String sql = "SELECT column_name FROM information_schema.columns  WHERE  table_schema = '" + schema
                + "'AND table_name = '" + table + "'";
        SqlService sqlService = new SqlService(dbConnection);
        return sqlService.executeQuery(sql);
    }

    @POST
    @Path("query")
    @Produces({"application/json"})
    public Response ExecuteQuery(@FormParam("DBConfig") String DBConfig, @FormParam("queryInfo") String queryInfo) throws IOException {   //每次都要传DBconfig,因为每次选择源的时候数据库可能会变
        DatabaseConnection dbConnection = (DatabaseConnection) JsonUtil.toPojo(DBConfig, DatabaseConnection.class);
        QueryInfo sqlInfo = JsonUtil.toPojo(queryInfo, QueryInfo.class);
        String sql = sqlInfo.getSql();
        SqlService sqlService = new SqlService(dbConnection);
        return sqlService.executeQuery(sql);
    }

}
