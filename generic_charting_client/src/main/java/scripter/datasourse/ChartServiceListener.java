/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package scripter.datasourse;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import scripter.datasourse.rest.ConnectionResource;
import scripter.datasourse.sourceclass.ConnectionManager;
import scripter.datasourse.sourceclass.DatabaseConnection;

/**
 *
 * @author gloomy
 */
@WebListener
public class ChartServiceListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
            ConnectionManager connectionManager = ConnectionManager.getInstance();
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        ConnectionManager connectionManager =ConnectionManager.getInstance();
        connectionManager.release();
    }


}
