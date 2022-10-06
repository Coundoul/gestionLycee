package mefpai.gouv.sn.domain;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.csv.QuoteMode;
import org.springframework.web.multipart.MultipartFile;


public class CSVHelper {
    public static String TYPE = "text/csv";
    static String[] HEADERs = {
        "Id",
        "nomPrenom",
        "dateNaissance",
        "lieuNaissance",
        "telephone",
        "adresse",
        "sexe",
        "option" ,
        "situationMatrimoniale",
        "tuteur",
        "contactTuteur"};

    public static boolean hasCSVFormat(MultipartFile file) {
      if (TYPE.equals(file.getContentType())
              || file.getContentType().equals("application/vnd.ms-excel")) {
        return true;
      }

      return false;
    }

    public static List<Apprenant> csvToTutorials(InputStream is) {
      try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
          CSVParser csvParser = new CSVParser(fileReader,
              CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim());) {

        List<Apprenant> apprenantList = new ArrayList<>();

        Iterable<CSVRecord> csvRecords = csvParser.getRecords();

        for (CSVRecord csvRecord : csvRecords) {
            Apprenant apprenant = new Apprenant(
                Long.parseLong(csvRecord.get("Id")),
                csvRecord.get("nomPrenom"),
                csvRecord.get("dateNaissance"),
                csvRecord.get("lieuNaissance"),
                csvRecord.get("telephone"),
                csvRecord.get("adresse"),
                csvRecord.get("sexe"),
                csvRecord.get("option"),
                csvRecord.get("situationMatrimoniale"),
                csvRecord.get("tuteur"),
                csvRecord.get("contactTuteur")
              );

            apprenantList.add(apprenant);
        }

        return apprenantList;
      } catch (IOException e) {
        throw new RuntimeException("fail to parse CSV file: " + e.getMessage());
      }
    }

    public static ByteArrayInputStream tutorialsToCSV(List<Apprenant> apprenantList) {
      final CSVFormat format = CSVFormat.DEFAULT.withQuoteMode(QuoteMode.MINIMAL);

      try (ByteArrayOutputStream out = new ByteArrayOutputStream();
          CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(out), format);) {
        for (Apprenant apprenant : apprenantList) {
          List<String> data = Arrays.asList(
                String.valueOf(apprenant.getId()),
                String.valueOf(apprenant.getNomPrenom()),
                String.valueOf(apprenant.getDateNaissance()),
                String.valueOf(apprenant.getLieuNaissance()),
                String.valueOf(apprenant.getTelephone()),
                String.valueOf(apprenant.getAdresse()),
                String.valueOf(apprenant.getSexe()),
                String.valueOf(apprenant.getOption()),
                String.valueOf(apprenant.getSituationMatrimoniale()),
                String.valueOf(apprenant.getTuteur()),
                String.valueOf(apprenant.getContactTuteur())
              );

          csvPrinter.printRecord(data);
        }

        csvPrinter.flush();
        return new ByteArrayInputStream(out.toByteArray());
      } catch (IOException e) {
        throw new RuntimeException("fail to import data to CSV file: " + e.getMessage());
      }
    }
  }
