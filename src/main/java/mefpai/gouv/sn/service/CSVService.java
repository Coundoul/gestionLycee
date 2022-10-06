package mefpai.gouv.sn.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import mefpai.gouv.sn.domain.Apprenant;
import mefpai.gouv.sn.domain.CSVHelper;
import mefpai.gouv.sn.repository.ApprenantRepository;

@Service
public class CSVService {
  @Autowired
  ApprenantRepository repository;

  public void save(MultipartFile file) {
    try {
      List<Apprenant> tutorials = CSVHelper.csvToTutorials(file.getInputStream());
      repository.saveAll(tutorials);
    } catch (IOException e) {
      throw new RuntimeException("fail to store csv data: " + e.getMessage());
    }
  }

  public ByteArrayInputStream load() {
    List<Apprenant> tutorials = repository.findAll();

    ByteArrayInputStream in = CSVHelper.tutorialsToCSV(tutorials);
    return in;
  }

  public List<Apprenant> getAllTutorials() {
    return repository.findAll();
  }
}
