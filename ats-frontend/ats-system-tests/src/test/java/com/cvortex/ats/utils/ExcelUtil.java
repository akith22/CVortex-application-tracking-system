package com.cvortex.ats.utils;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public final class ExcelUtil {

    private ExcelUtil() {
    }

    public static List<String[]> readSheet(String resourcePath, String sheetName) {
        try (InputStream inputStream = ExcelUtil.class.getClassLoader().getResourceAsStream(resourcePath)) {
            if (Objects.isNull(inputStream)) {
                throw new IllegalStateException("Missing Excel resource: " + resourcePath);
            }
            try (Workbook workbook = new XSSFWorkbook(inputStream)) {
                Sheet sheet = workbook.getSheet(sheetName);
                if (sheet == null) {
                    throw new IllegalStateException("Sheet not found: " + sheetName);
                }
                DataFormatter formatter = new DataFormatter();
                List<String[]> rows = new ArrayList<>();
                for (Row row : sheet) {
                    String[] values = new String[row.getLastCellNum()];
                    for (int index = 0; index < row.getLastCellNum(); index++) {
                        Cell cell = row.getCell(index);
                        values[index] = cell == null ? "" : formatter.formatCellValue(cell);
                    }
                    rows.add(values);
                }
                return rows;
            }
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to read Excel resource", exception);
        }
    }
}
