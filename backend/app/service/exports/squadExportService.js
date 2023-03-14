const Sequelize = require('sequelize');
const Service = require('egg').Service;
const { AnswerCategories } = require('../../enums/answerCategories');
class SquadExportService extends Service {
  async getDataInSquadFormatToExport(projectId, userId = null) {
    const answersInSquadFormat = [];
    // first, get all reqired information from database;
    const { allDocuments, allQuestions, allAnswers } =
      await this._getAllDocumentsOfProject(projectId, userId);

    for (const document of allDocuments) {
      const qas = this._mapCorrectQuestonAnswersForDocument(
        document.id,
        allQuestions,
        allAnswers
      );
      if (!qas || qas.length === 0) continue;
      const documentData = {
        paragraphs: [
          {
            qas,
            context: document.text,
            document_id: document.id,
            name: document.unique_document_name,
          },
        ],
      };

      answersInSquadFormat.push(documentData);
    }

    return answersInSquadFormat;
  }

  async getDataInCSVFormatToExport(projectId, userId = null) {
    // first, get all reqired information from database;
    const { allDocuments, allQuestions, allAnswers } =
      await this._getAllDocumentsOfProject(projectId, userId);

    let keys = Object.keys(allAnswers[0].dataValues);
    keys = [ ...keys, 'question', 'file_name', 'context' ];

    const answersCSVArray = [ keys ];

    for (const answer of allAnswers) {
      const question = allQuestions.find(
        question => question.id === answer.question_id
      );
      const document = allDocuments.find(
        document => document.id === answer.document_id
      );

      let contextStartOffset = answer.dataValues.answer_start - 300;
      let contextEndOffset = answer.dataValues.answer_end + 300;
      contextStartOffset = contextStartOffset < 0 ? 0 : contextStartOffset;
      contextEndOffset = contextEndOffset > document.text.length ? document.text.length : contextEndOffset;
      const context = document.text.slice(contextStartOffset, contextEndOffset);

      answersCSVArray.push([
        ...Object.values(answer.dataValues),
        question.text,
        document.file_name,
        context,
      ]);
    }

    return answersCSVArray;
  }

  async _getAllDocumentsOfProject(projectId, userId = false) {
    const { Question, Answer, Document } = this.ctx.model;

    const allDocuments = await Document.findAll({
      where: { project_id: projectId },
      attributes: [ 'id', 'text', 'file_name' ],
    });

    const allQuestions = await Question.findAll({
      where: { project_id: +projectId },
      attributes: [ 'id', 'document_id', 'text' ],
    });

    const allDocumentIds = allDocuments.map(document => document.id);

    const answerQuery = {
      document_id: { [Sequelize.Op.in]: allDocumentIds },
      [Sequelize.Op.or]: [
        { answer_category: { [Sequelize.Op.eq]: null } },
        {
          answer_category: {
            [Sequelize.Op.ne]: AnswerCategories.NOT_UNDERSTOOD,
          },
        },
      ],
    };
    if (userId) {
      answerQuery.user_id = userId;
    }
    const allAnswers = await Answer.findAll({
      where: answerQuery,
      attributes: [
        [ 'id', 'answer_id' ],
        [ 'document_id', 'document_id' ],
        [ 'question_id', 'question_id' ],
        [ 'selected_text', 'text' ],
        [ 'start_offset', 'answer_start' ],
        [ 'end_offset', 'answer_end' ],
        [ 'answer_category', 'answer_category' ],
      ],
    });
    return { allDocuments, allQuestions, allAnswers };
  }

  /*
   * Filter allQuestions and allAnswers to only for this document relevant questions and answers
   * returns:
   *  [{
        question: questionText,
        id: questionId,
        answers: answersForQuestion,
        is_impossible: bool
      }]
   *
   */
  _mapCorrectQuestonAnswersForDocument(documentId, allQuestions, allAnswers) {
    const qas = [];
    // find "global scope" questions or specific for this document.
    const relevantQuestionForThisDocument = allQuestions.filter(
      question =>
        question.document_id === documentId || question.document_id === null
    );
    const documentAnswers = allAnswers.filter(
      answer => answer.document_id === documentId
    );
    // find if this question was answered and if yes add it to QAS array
    for (const question of relevantQuestionForThisDocument) {
      const answersForQuestion = documentAnswers.filter(
        answer => answer.question_id === question.id
      );
      if (documentAnswers.length > 0) {
        // console.log(answersForQuestion)
      }
      if (!answersForQuestion.length) continue;

      const is_impossible = !answersForQuestion.find(
        a => a.answer_category !== AnswerCategories.NOT_GIVEN
      );
      const answersWithoutNotGiven = answersForQuestion.filter(
        a => a.answer_category !== AnswerCategories.NOT_GIVEN
      );

      const qasItem = {
        question: question.text,
        id: question.id,
        answers: answersWithoutNotGiven,
        is_impossible,
      };
      qas.push(qasItem);
    }

    return qas;
  }
}

module.exports = SquadExportService;
