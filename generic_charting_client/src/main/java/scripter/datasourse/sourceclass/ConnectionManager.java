/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package scripter.datasourse.sourceclass;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import scripter.datasourse.ChartServiceListener;

/**
 *
 * @author gloomy 单例的数据库连接管理类
 */
public class ConnectionManager {

    static private ConnectionManager instance;           //唯一数据库连接管理类
    private ConcurrentHashMap conns = new ConcurrentHashMap();       //连接放在hashmap中

//实例化管理类
    public ConnectionManager() {    //?
        this.init();
    }

//初始化连接
    private void init() {
        List<DatabaseConnection> list = GetDatabaseConfig();
        for (DatabaseConnection databaseConnection : list) {
            try {
                Class.forName(databaseConnection.getDbDriver());
                Connection con = DriverManager.getConnection(databaseConnection.getDbUrl(), databaseConnection.getDbUsername(), databaseConnection.getDbPasswd());
                if(con != null){
                    conns.put(databaseConnection.getDbUrl(), con);
                }
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(ConnectionManager.class.getName()).log(Level.SEVERE, null, ex);
            } catch (SQLException ex) {
                Logger.getLogger(ConnectionManager.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

//得到管理类唯一实例
    static synchronized public ConnectionManager getInstance() {
        if (instance == null) {
            instance = new ConnectionManager();
        }
        return instance;
    }

    /**
     * 通过名字得到一个连接
     *
     * @param name
     * @return conn
     */
    public Connection getConnection(String name) {
        Connection con = null;
        con = (Connection) conns.get(name);

        return con;
    }

    /**
     * 在hashmap中加入一个连接
     *
     * @param databaseConnection
     */
    synchronized public void addConnection(DatabaseConnection databaseConnection) {
        Connection con = null;
        if(conns.containsKey(databaseConnection.getDbUrl())){
            return;
        }
        try {
            Class.forName(databaseConnection.getDbDriver());
            con = DriverManager.getConnection(databaseConnection.getDbUrl(), databaseConnection.getDbUsername(), databaseConnection.getDbPasswd());
            if (con != null) {
                conns.put(databaseConnection.getDbUrl(), con);
            } else {
                //log 
            }
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(ConnectionManager.class.getName()).log(Level.SEVERE, null, ex);
        } catch (SQLException ex) {
            Logger.getLogger(ConnectionManager.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

    /**
     * 通过名字释放一个连接
     *
     * @param name
     */
    public void deleteConnection(String name) {
        Connection con = null;
        con = (Connection) conns.get(name);
        if (con != null) {
            try {
                con.close();
            } catch (SQLException ex) {
                Logger.getLogger(ConnectionManager.class.getName()).log(Level.SEVERE, null, ex);
            } finally {
                if (con != null) {
                    try {
                        con.close();
                    } catch (SQLException ex) {
                        Logger.getLogger(ConnectionManager.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
            }
        }
        conns.remove(name);
    }

    /**
     * 释放所有连接,用于contextDestroyed
     */
    public void release() {
        Enumeration allconns = conns.elements();
        while (allconns.hasMoreElements()) {
            Connection con = (Connection) allconns.nextElement();
            try {
                con.close();
            } catch (SQLException ex) {
                Logger.getLogger(ConnectionManager.class.getName()).log(Level.SEVERE, null, ex);
            } finally {
                if (con != null) {
                    try {
                        con.close();
                    } catch (SQLException ex) {
                        Logger.getLogger(ConnectionManager.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
            }
        }
        conns.clear();
    }

    /**
     * 获取数据库中已存储的连接信息
     * @return list
     */
    public List<DatabaseConnection> GetDatabaseConfig() {
        Connection con = null;
        List list = new ArrayList();
        try {
            Class.forName("org.postgresql.Driver");
            DatabaseConnection databaseConnection = new DatabaseConnection();
            con = DriverManager.getConnection("jdbc:postgresql://localhost:5432/scripter", "postgres", "123456");
            if (con != null) {
                Statement st = con.createStatement();
                String sql = "select stringalpha, stringbeta, stringdelta, stringepsilon from genericentity where deleted= false and type= 'SOURCE_DATABASE_CONFIGURATION' and enabled= true";     //stringalpha=DBdriver,stringbeta=DBurl,stringdelta=dbuser,stringepsilon=pwd
                ResultSet rs = st.executeQuery(sql);
                while (rs.next()) {
                    System.out.println(rs.getString(1));
                    System.out.println(rs.getString(2));
                    System.out.println(rs.getString(3));
                    System.out.println(rs.getString(4));
                    databaseConnection.setDbDriver(rs.getString(1));
                    databaseConnection.setDbUrl(rs.getString(2));
                    databaseConnection.setDbUsername(rs.getString(3));
                    databaseConnection.setDbPasswd(rs.getString(4));
                    list.add(databaseConnection);
                }
                rs.close();
                st.close();
                con.close();
            } else {
                System.out.println("连接失败!");
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (SQLException ex) {
                    Logger.getLogger(ChartServiceListener.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }

        return list;
    }

}
