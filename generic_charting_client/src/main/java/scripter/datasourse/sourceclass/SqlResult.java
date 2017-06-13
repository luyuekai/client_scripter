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
public class SqlResult {
    int status = 403;
    String info = "";
    String data = "Error";
    boolean hasQueryResultData = false;

    public SqlResult(int status, String info, String data) {
        this.status = status;
        this.info = info;
        this.data = data;
    }
    
    public SqlResult(int status, String data){
        this.status = status;
        this.data = data;
    }

 

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public boolean isHasQueryResultData() {
        return hasQueryResultData;
    }

    public void setHasQueryResultData(boolean hasQueryResultData) {
        this.hasQueryResultData = hasQueryResultData;
    }    

}
