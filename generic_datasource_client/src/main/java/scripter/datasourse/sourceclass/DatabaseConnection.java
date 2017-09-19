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
public class DatabaseConnection {
    
    private String dbType;
    private String dbDriver;
    private String dbConName;
    private String dbUsername;
    private String dbPasswd;
    private String dbUrl;
    private boolean enable;
    private int dbID;

    public String getDbUrl() {
        return dbUrl;
    }

    public void setDbUrl(String dbUrl) {
        this.dbUrl = dbUrl;
    }

    public String getDbType() {
        return dbType;
    }

    public void setDbType(String dbType) {
        this.dbType = dbType;
    }

    public String getDbDriver() {
        return dbDriver;
    }

    public void setDbDriver(String dbDriver) {
        this.dbDriver = dbDriver;
    }

    public String getDbConName() {
        return dbConName;
    }

    public void setDbConName(String dbConName) {
        this.dbConName = dbConName;
    }

    public String getDbUsername() {
        return dbUsername;
    }

    public void setDbUsername(String dbUsername) {
        this.dbUsername = dbUsername;
    }

    public String getDbPasswd() {
        return dbPasswd;
    }

    public void setDbPasswd(String dbPasswd) {
        this.dbPasswd = dbPasswd;
    }
    
    public int getdbID(){
        return dbID;
    }
    public void setdbID(int i){
        this.dbID = i;
    }
    
    public boolean getEnable(){
        return enable;
    }
    public void setEnable(boolean e){
        this.enable = e;
    }
}